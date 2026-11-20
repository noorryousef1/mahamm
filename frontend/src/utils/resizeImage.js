function resizeImage(file, maxWidth = 800) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("ما قدرنا نقرأ الملف"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("صيغة الصورة مش مدعومة"));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export const imageErrorMessage =
  "ما قدرنا نفتح الصورة. جرّب صورة JPG أو PNG (صور HEIC من الآيفون مش مدعومة).";

export default resizeImage;
