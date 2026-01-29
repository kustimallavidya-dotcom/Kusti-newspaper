
export const getMarathiDate = (): string => {
  const date = new Date();
  
  const marathiMonths = [
    "जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून",
    "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"
  ];
  
  const marathiDays = [
    "रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"
  ];

  const marathiDigits = (n: number) => {
    return n.toString().replace(/\d/g, d => "०१२३४५६७८९"[parseInt(d)]);
  };

  const day = marathiDigits(date.getDate());
  const month = marathiMonths[date.getMonth()];
  const year = marathiDigits(date.getFullYear());
  const dayName = marathiDays[date.getDay()];

  // Placeholder for Tithi
  const tithi = "शुक्ल पक्ष / तिथी"; 

  return `${day} ${month} ${year}, ${dayName} (${tithi})`;
};
