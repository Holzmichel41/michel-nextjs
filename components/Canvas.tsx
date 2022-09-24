import React, { useCallback, useEffect, useRef, useState } from "react";

const frameCount = 160;

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [images, setImages] = useState<string[]>([]);
  const [currentFrame, setCurrentFrame] = useState(1);

  const getConvertedStringIndex = (index: number) => {
    return index.toString().padStart(3, "0");
  };

  const getFrameUrl = useCallback((index: number) => {
    const url = `/canvas/ezgif-frame-${getConvertedStringIndex(index)}.webp`;
    // console.log(url);
    return url;
  }, []);

  const preloadImages = useCallback(() => {
    const fetchedImageUrls = [];
    for (let i = 1; i <= frameCount; i += 1) {
      fetchedImageUrls.push(getFrameUrl(i));
    }
    setImages(fetchedImageUrls);
  }, [getFrameUrl]);

  useEffect(() => {
    const scrollEventListener = () => {
      const html = document.documentElement;
      const scrollTop = html.scrollTop || 0;
      const maxScrollTop = html.scrollHeight || 0 - window.innerHeight;
      const scrollFraction = (scrollTop * 1.5) / maxScrollTop;
      const frameIndex = Math.min(
        frameCount,
        Math.ceil(scrollFraction * frameCount)
      );
      console.log(
        "frameIndex",
        scrollTop,
        maxScrollTop,
        frameIndex,
        frameCount,
        scrollFraction
      );
      requestAnimationFrame(() => setCurrentFrame(frameIndex));
    };
    window.addEventListener("scroll", scrollEventListener);

    return () => {
      window.removeEventListener("scroll", scrollEventListener);
    };
  }, []);

  useEffect(() => {
    preloadImages();
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 4000;
      canvas.height = 3000;
    }
  }, [preloadImages]);

  useEffect(() => {
    if (images.length) {
      console.log("currentFrame", currentFrame);
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const image = images[currentFrame];
      const img = new Image();
      img.src = image;
      img.onload = () => {
        context?.drawImage(img, 0, 0, canvas?.width || 0, canvas?.height || 0);
      };
    }
  }, [images, images.length, currentFrame]);

  return (
    <div>
      <canvas id="canvas" ref={canvasRef} />
    </div>
  );
};

export default Canvas;
