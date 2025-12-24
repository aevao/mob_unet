import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { ThemedCard } from '../../../shared/ui/ThemedCard';
import { useThemeStore } from '../../../entities/theme/model/themeStore';

// Настройка русской локали для календаря
LocaleConfig.locales['ru'] = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сегодня',
};

LocaleConfig.defaultLocale = 'ru';

interface TabelCalendarProps {
  selectedDate: string;
  markedDates: Record<string, any>;
  onDayPress: (day: DateData) => void;
}

export const TabelCalendar = ({ selectedDate, markedDates, onDayPress }: TabelCalendarProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <ThemedCard className="mb-4 overflow-hidden">
      <Calendar
        current={selectedDate}
        onDayPress={onDayPress}
        markedDates={markedDates}
        theme={{
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
          calendarBackground: isDark ? '#111827' : '#FFFFFF',
          textSectionTitleColor: isDark ? '#9CA3AF' : '#6B7280',
          selectedDayBackgroundColor: isDark ? '#3B82F6' : '#2563EB',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: isDark ? '#60A5FA' : '#2563EB',
          dayTextColor: isDark ? '#F9FAFB' : '#111827',
          textDisabledColor: isDark ? '#4B5563' : '#D1D5DB',
          dotColor: isDark ? '#60A5FA' : '#2563EB',
          selectedDotColor: '#FFFFFF',
          arrowColor: isDark ? '#60A5FA' : '#2563EB',
          monthTextColor: isDark ? '#F9FAFB' : '#111827',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 13,
        }}
        style={{
          borderRadius: 12,
        }}
      />
    </ThemedCard>
  );
};

