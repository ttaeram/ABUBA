import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import koLocale from '@fullcalendar/core/locales/ko';
import styled from 'styled-components';
import { sentimentCalendar } from '../../api/calendar';

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
  const currentYear = new Date().getFullYear(); 
  const currentMonth = new Date().getMonth() + 1; 

  useEffect(() => {
    const fetchSentimentData = async () => {
      try {
        const response = await sentimentCalendar(currentYear, currentMonth);
        const formattedEvents = formatEvents(response.data.posts);
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
      }
    };

    fetchSentimentData();
  }, []);

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

  return (
    <CalendarContainer>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        events={events}
        locale='ko'
        eventContent={(arg) => { 
          return arg.event.title;  
        }}
      />
    </CalendarContainer>
  );
};

export default TeamDateCalendar;

const CalendarContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .fc {
    width: 100%;
    height: 100%;
    max-width: 100vw;
    max-height: 100vh;
    overflow: hidden;
  }

  .fc .fc-toolbar.fc-header-toolbar {
    margin-top: 20px;
    padding: 0 2vw;
    background-color: #1f1f45;
    height: 63px;
    font-weight: 600;
    font-size: 1.3rem;
    color: white;
    border-radius: 20px;
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
    background: #1f1f45;
    border: 1px solid #dddee0;
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
    width: 100%;
    height: 100%;
    padding: 5px;
    margin-bottom: 5px;
  }

  .fc .fc-daygrid-day-top {
    flex-direction: row;
    padding: 10px 0 0 10px;
  }

  .fc-event {
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 0.875rem; 
  }

  .fc-day-sun a {
    color: red;
    text-decoration: none;
  }

  .fc-day-sat a {
    color: blue;
    text-decoration: none;
  }
`;
