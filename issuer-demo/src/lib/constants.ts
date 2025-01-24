export  const optionsLineChartFilterCascade = {
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Bloom Filter Cascade Size (bytes)",
        color: "rgba(54, 162, 235, 1)",
      },
    },
    "y-axis-2": {
      type: "linear",
      position: "right",
      min: 0,
      max: 6,
      title: {
        display: true,
        text: "Number of Blobs",
        color: "rgba(255, 99, 132, 1)",
      },
    },
  },
  responsive: true,
};

export const optionsLineChartEntries = {
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Number of Entries",
        color: "rgba(54, 162, 235, 1)",
      },
    },
    "y-axis-2": {
      type: "linear",
      position: "right",
      beginAtZero: true,

      title: {
        display: true,
        text: "Number of Layers",
        color: "rgba(9, 98, 5, 0.6)",
      },
    },
  },
  responsive: true,
};

export const timeAgo = (date: string) => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );

  if (seconds < 60) return `${seconds} second(s) ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute(s) ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour(s) ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day(s) ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month(s) ago`;

  const years = Math.floor(months / 12);
  return `${years} year(s) ago`;
};