export const resizeImage = (
    file: File,
    maxWidth: number,
    maxHeight: number,
    callback: (blob: Blob) => void
  ) => {
    const img = new Image();
    const reader = new FileReader();
  
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target && typeof event.target.result === "string") {
        img.src = event.target.result;
      }
    };
  
    img.onload = () => {
      let width = img.width;
      let height = img.height;
  
      // 이미지가 지정된 크기를 초과하면 리사이즈
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height *= maxWidth / width;
          width = maxWidth;
        } else {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
  
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
  
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
  
        // 파일 크기가 500KB를 넘는지 확인하고 압축 적용
        canvas.toBlob(
          (blob) => {
            if (blob) {
              if (blob.size > 500 * 1024) {
                // 500KB 초과하면 압축
                canvas.toBlob(
                  (compressedBlob) => {
                    if (compressedBlob) {
                      callback(compressedBlob);
                    }
                  },
                  file.type,
                  0.7 // 압축 품질 70%
                );
              } else {
                // 500KB 이하이면 그대로 전달
                callback(blob);
              }
            }
          },
          file.type
        );
      }
    };
  
    return reader.readAsDataURL(file);
  };
  