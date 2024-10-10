import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import koLocale from '@fullcalendar/core/locales/ko';
import styled from 'styled-components';
import { sentimentCalendar } from '../../api/calendar';
import { DayCellContentArg } from '@fullcalendar/core';

interface DiaryPost {
  diaryId: number;
  title: string;
  createdAt: string;
  sentiment: string;
}

interface PostsResponse {
  date: string;
  posts: DiaryPost[];
}

const TeamDateCalendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchSentimentData();
  }, []);

  const fetchSentimentData = async () => {
    try {
      const response = await sentimentCalendar(currentYear, currentMonth);
      const formattedEvents = formatEvents(response.data.posts);
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching sentiment data:", error);
    }
  };

  const formatEvents = (posts: PostsResponse[]): any[] => {
    return posts.flatMap(post => {
      return post.posts.map(diary => {
        let emoji = "";
        switch (diary.sentiment) {
          case "positive":
            emoji = "😊"; 
            break;
          case "negative":
            emoji = "😢"; 
            break;
          case "neutral":
            emoji = "😐"; 
            break;
          default:
            emoji = "";
        }

        return {
          title: emoji,  
          start: diary.createdAt,
          diaryId: diary.diaryId,
        };
      });
    });
  };

  const handleDayCellContent = (arg: DayCellContentArg) => {
    const dayNumber = arg.dayNumberText.replace("일", "");
    return dayNumber;
  };

  const handleDatesSet = (dateInfo: { start: Date; end: Date }) => {
    const newYear = dateInfo.start.getFullYear();
    const newMonth = dateInfo.start.getMonth() + 1; 
    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
    fetchSentimentData();
  };

  return (
    <CalendarContainer>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        events={events}
        locale='ko'
        eventContent={(arg) => { 
          return <StyledEmoji>{arg.event.title}</StyledEmoji>;
        }}
        dayCellContent={handleDayCellContent}
        datesSet={handleDatesSet} 
      />
    </CalendarContainer>
  );
};

export default TeamDateCalendar;

const CalendarContainer = styled.div`
  width: 100%;
  height: 100vh; 
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 0 20px;

  .fc {
    width: 100%;
    height: 100%; 
    max-width: none; 
    max-height: none; 
  }

  .fc .fc-toolbar.fc-header-toolbar {
    padding: 10px 20px;
    background-color: #173C91;
    height: 63px;
    font-weight: 600;
    font-size: 10px;
    color: white;
    border-radius: 10px;
  }

  .fc .fc-button-primary {
    background-color: transparent;
    border: none;

    span {
      font-size: 1.875rem;
    }

    :hover {
      background-color: transparent;
    }
  }

  .fc-theme-standard th {
    height: 32px;
    padding-top: 3.5px;
    background: #173C91;
    border: 1px solid #dddee0;
    border: none; 
    font-weight: 100;
    font-size: 1rem; 
    color: white;
  }

  .fc .fc-daygrid-day.fc-day-today {
    color: #1f1f45;
  }

  .fc .fc-daygrid-day-frame {
    display: flex;
    flex-direction: column;
    border: none; 
    width: 100%;
    height: 100%;
    margin-bottom: 5px;
  }

  .fc .fc-daygrid-day {
    border: none; 
    background: none; 
  }

  .fc .fc-daygrid-day > div {
    border: none; 
    background: none; 
  }

  .fc .fc-daygrid-day-top {
    flex-direction: row;
    padding: 10px 0 0 10px;
  }

  .fc-event {
    cursor: pointer;
    display: flex;
    justify-content: center;
    border-radius: 4px;
    font-weight: 500;
    font-size: 0.875rem; 
    border: none; 
  }

  .fc-day-sun a, .fc-day-sat a {
    text-decoration: none;
  }
`;

const StyledEmoji = styled.span`
  display: flex; 
  justify-content: center; 
  align-items: center; 
  font-size: 2rem; 
  line-height: 1; 
`;
