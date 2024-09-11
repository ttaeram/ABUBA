import { useEffect, useState, useCallback } from "react"
import DiaryListCard from "../../components/layouts/DiaryListCard"
import BackButton from "../../components/buttons/BackButton"

const DiaryList = () => {
  const [diaries, setDiaries] = useState<{ id: number; title: string; content: string }[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  // 임시 데이터
  const fetchMoreDiaries = (page: number) => {
    setLoading(true)
    
    const newDiaries = Array.from({ length: 10 }, (_, index) => ({
      id: (page - 1) * 10 + index + 1,
      title : `일기 ${(page - 1) * 10 + index + 1}`,
      content: `일기 내용 ${(page - 1) * 10 + index + 1}`,
    }))
    setTimeout(() => {
      setDiaries((prev) => [...prev, ...newDiaries])
      setLoading(false)
    }, 1000);
  }

  // 스크롤 이벤트
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
      return
    }
    setPage((prevPage) => prevPage + 1)
  }, [loading])

  // 페이지가 변경되면 새로운 데이터를 불러옴
  useEffect(() => {
    fetchMoreDiaries(page)
  }, [page])

  // 무한 스크롤 이벤트 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <div>
      <h1>Diary List</h1>
      <BackButton />
      <div>
        {diaries.map((diary) => (
          <DiaryListCard key={diary.id} diary={diary} />
        ))}
      </div>
      {loading && <p>로딩 중...</p>}
    </div>
  )
}

export default DiaryList
