import React, { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const PropertyGallery = ({ images = [], title }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () =>
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  if (!images.length) return null;

  return (
    <div className="w-full">
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src={images[activeIndex]}
          alt={`${title} - ${activeIndex + 1}`}
          className="w-full h-64 md:h-96 lg:h-[28rem] object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow hover:bg-opacity-100 transition"
            >
              <MdChevronLeft className="text-2xl text-blue" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow hover:bg-opacity-100 transition"
            >
              <MdChevronRight className="text-2xl text-blue" />
            </button>
          </>
        )}
        <span className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
          {activeIndex + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`thumb-${i}`}
              onClick={() => setActiveIndex(i)}
              className={`h-16 w-24 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all ${
                i === activeIndex
                  ? "ring-2 ring-blue opacity-100"
                  : "opacity-60 hover:opacity-90"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
