export function formatDateTime(date, time) {
  const appointmentDate = new Date(date);
  const appointmentTime = new Date(time);

  const formattedDate = appointmentDate.toLocaleDateString("tr-TR");
  const formattedTime = appointmentTime.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} ${formattedTime}`;
}

export function getStatusText(status) {
  switch (status) {
    case 0:
      return "Beklemede";
    case 1:
      return "Onaylandı";
    case 2:
      return "Reddedildi";
    default:
      return "Bilinmeyen";
  }
}

export function getStatusClass(status) {
  switch (parseInt(status)) {
    case 0:
      return "bg-yellow-600";
    case 1:
      return "bg-green-600"; 
    case 2:
      return "bg-red-600";    
    default:
      return "bg-blue-600";   
  }
}