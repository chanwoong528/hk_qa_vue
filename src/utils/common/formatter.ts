export function formatDateTime(isoString: string): string {
  // ISO 문자열을 Date 객체로 변환
  const date: Date = new Date(isoString);

  // 옵션 설정: 날짜와 24시간 형식의 시간(시간과 분까지만) 포함
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,  // 24시간 형식 사용
  };

  // 형식을 지정하여 날짜와 시간 포맷팅
  const formattedDate: string = new Intl.DateTimeFormat('ko-KR', options).format(date);

  return formattedDate;
}