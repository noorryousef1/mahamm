import { initializeApp, deleteApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import { db, auth } from "./firebase";

const withId = (snap) => ({ id: snap.id, ...snap.data() });

async function getAll(name) {
  const snap = await getDocs(collection(db, name));
  return snap.docs.map(withId);
}

async function save(name, item) {
  const { id, ...data } = item;
  if (id) {
    await setDoc(doc(db, name, id), data, { merge: true });
    return item;
  }
  const newId = String(Date.now());
  await setDoc(doc(db, name, newId), data);
  return { id: newId, ...data };
}

const byDateDesc = (a, b) => (b.createdAt || "").localeCompare(a.createdAt || "");

export const getEvents = () => getAll("events");
export const getMembers = () => getAll("members");
export const saveEvent = (event) => save("events", event);
export const saveMember = (member) => save("members", member);

export async function getApprovedFeedback() {
  const snap = await getDocs(query(collection(db, "feedback"), where("status", "==", "approved")));
  return snap.docs.map(withId);
}

export async function getAllFeedback() {
  return (await getAll("feedback")).sort(byDateDesc);
}

export function sendFeedback({ name, eventName, text }) {
  return addDoc(collection(db, "feedback"), {
    name,
    eventName,
    text,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
}

export const setFeedbackStatus = (id, status) => updateDoc(doc(db, "feedback", id), { status });
export const deleteFeedback = (id) => deleteDoc(doc(db, "feedback", id));

export async function createBooking(booking) {
  await setDoc(doc(db, "bookings", booking.code), booking);
  return booking;
}

export async function getBookingByCode(code) {
  const snap = await getDoc(doc(db, "bookings", code));
  return snap.exists() ? withId(snap) : null;
}

export async function getBookings() {
  return (await getAll("bookings")).sort(byDateDesc);
}

export async function updateBooking(id, changes) {
  await updateDoc(doc(db, "bookings", id), changes);
  return withId(await getDoc(doc(db, "bookings", id)));
}

export async function getAdminProfile(uid) {
  const snap = await getDoc(doc(db, "admins", uid));
  return snap.exists() ? withId(snap) : null;
}

export const getAdmins = () => getAll("admins");

export async function login(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getAdminProfile(user.uid).catch(() => null);
  if (!profile) {
    await signOut(auth);
    throw new Error("not-admin");
  }
  return profile;
}

export const logout = () => signOut(auth);

export async function createAdmin({ name, email, password }) {
  const secondary = initializeApp(auth.app.options, "create-admin-" + Date.now());
  try {
    const { user } = await createUserWithEmailAndPassword(getAuth(secondary), email, password);
    const profile = { name, email, role: "admin" };
    await setDoc(doc(db, "admins", user.uid), profile);
    return { id: user.uid, ...profile };
  } finally {
    await deleteApp(secondary);
  }
}

export async function updateAdmin(id, { name }) {
  await updateDoc(doc(db, "admins", id), { name });
  return withId(await getDoc(doc(db, "admins", id)));
}

export const deleteAdmin = (id) => deleteDoc(doc(db, "admins", id));

export const changeMyPassword = (password) => updatePassword(auth.currentUser, password);
