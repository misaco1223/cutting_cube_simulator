import { useRef, useState, useEffect } from "react";
import BookmarkCard from "./BookmarkCard";
import { useGetBookmarks } from "./useGetBookmarks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faBookmark, faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const BookmarksCarousel= () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { bookmarkIds, cutCubeIds, glbUrls, cutPoints, createdAt, titles, memos } = useGetBookmarks();
  const [showMoreButton, setShowMoreButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // スクロール位置が 5つ目（4番目の要素）より右に行ったらボタンを表示
      const threshold = (scrollWidth / bookmarkIds.length) * 14; // 5つ目
      setShowMoreButton(scrollLeft >= threshold - clientWidth);
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [bookmarkIds]);

  if (!bookmarkIds || bookmarkIds.length === 0) {
    return (
      <div className="p-2">
        <p>ブックマークされた切断はありません。</p>
      </div>
    );
  }

  const handleRemoveBookmark = async(bookmarkId: string) => {
    try {
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="relative flex h-full w-full p-2 max-w-full">
      <div  ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory p-2 scrollbar-hide"
      >
        {bookmarkIds.map((bookmarkId, index) => (
        <div key={bookmarkId} className="shrink-0">
          <div className="w-48 h-full border border-gray-200 p-2 rounded-lg shadow-md flex flex-grow flex-col justify-between ">
            <BookmarkCard
              glbUrl={glbUrls[index]}
              cutPoints={cutPoints[index]}
              createdAt={createdAt[index]}
              title={titles[index]}
              memo={memos[index]}
            />
            <div className="px-4 mt-auto flex space-x-4">
              <Link to={`/result/${cutCubeIds[index]}`} className="text-blue-500 hover:underline">詳細を見る</Link>
              <div className="items-center">
                <button 
                  onClick={() => {
                    if (window.confirm("ブックマークをはずします。")) {
                      handleRemoveBookmark(bookmarkId);
                    }} 
                  }
                  className="flex flex-col space-y-1"
                >
                  <FontAwesomeIcon icon={faBookmark} size="lg" className="text-yellow-500 hover:text-yellow-100"/>
                  <span className="text-xs text-gray-600">はずす</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        ))}
      </div>

      <div className="flex justify-center items-center flex-1">
        {showMoreButton && (
          <button className="w-full my-auto font-bold text-blue-500" onClick={() => alert("もっと見る")}>
            <FontAwesomeIcon icon={faAngleRight} size="xl"/>
          </button>
        )}
      </div>
    </div>
  );
};

export default BookmarksCarousel;
