import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export const formatDate = (dateString) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrowWithoutTime = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  
  const daysLeft = Math.ceil((dateWithoutTime - todayWithoutTime) / (1000 * 60 * 60 * 24));
  
  if (dateWithoutTime < todayWithoutTime) {
    return {
      text: format(date, 'd MMMM yyyy', { locale: tr }),
      color: "text-red-600",
      warning: "Gecikmiş görev!",
      warningColor: "bg-red-900/30 border-red-700/30",
      daysLeft
    };
  } else if (dateWithoutTime.getTime() === todayWithoutTime.getTime()) {
    return {
      text: "Bugün",
      color: "text-orange-600",
      warning: "Bugün son gün!",
      warningColor: "bg-orange-900/30 border-orange-700/30",
      daysLeft
    };
  } else if (dateWithoutTime.getTime() === tomorrowWithoutTime.getTime()) {
    return {
      text: "Yarın",
      color: "text-blue-600",
      warning: "Yarın son gün!",
      warningColor: "bg-blue-900/30 border-blue-700/30",
      daysLeft
    };
  } else if (daysLeft <= 3) {
    return {
      text: format(date, 'd MMMM yyyy', { locale: tr }),
      color: "text-purple-600",
      warning: `Son ${daysLeft} gün!`,
      warningColor: "bg-purple-900/30 border-purple-700/30",
      daysLeft
    };
  } else {
    return {
      text: format(date, 'd MMMM yyyy', { locale: tr }),
      color: "text-gray-600",
      daysLeft
    };
  }
}; 