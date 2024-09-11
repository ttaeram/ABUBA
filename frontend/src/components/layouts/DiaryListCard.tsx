const DiaryListCard = ({ diary }: { diary: { id: number; title: string; content: string } }) => {
  return (
    <div style={{ border: '1px solid #ddd', margin: '10px', padding: '15px', borderRadius: '8px' }}>
      <h2>{diary.title}</h2>
      <p>{diary.content}</p>
    </div>
  )
}

export default DiaryListCard