export const resizeImage = (file: File, maxWidth: number, maxHeight: number, callback: (blob: Blob) => void) => {
    const img = new Image();
    const reader = new FileReader();
  
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target && typeof event.target.result === 'string') {
        img.src = event.target.result;
      }
    };
  
    img.onload = () => {
      let width = img.width;
      let height = img.height;
  
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height *= maxWidth / width;
          width = maxWidth;
        } else {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
  
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
  
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            callback(blob);
          }
        }, file.type, 0.7);  // 70% 품질로 압축
      }
    };
  
    return reader.readAsDataURL(file);
  };
  