import moment from 'moment';
import React from 'react';

interface DateTimeFormatterProps {
    timestamp: string | undefined;
}

const DateTimeFormatter: React.FC<DateTimeFormatterProps> = ({ timestamp }) => {

    const formatDateTime = () => {
        if (timestamp) {
          const date = new Date(timestamp);
          return moment.utc(date).local().format('DD/MM/YYYY HH:mm:ss');
        }
        return "";
    }

    return (
        <>
            {formatDateTime()}
        </>
    )
}

export { DateTimeFormatter }
