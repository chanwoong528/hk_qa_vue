import { E_ReactionType, E_TestStatus } from "@/types/enum.d";
import { IReaction } from "@/types/types";

export function formatDateTime(isoString: string): string {
  // ISO 문자열을 Date 객체로 변환
  const date: Date = new Date(isoString);

  // 옵션 설정: 날짜와 24시간 형식의 시간(시간과 분까지만) 포함
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false, // 24시간 형식 사용
  };

  // 형식을 지정하여 날짜와 시간 포맷팅
  const formattedDate: string = new Intl.DateTimeFormat("ko-KR", options).format(date);

  return formattedDate;
}
export function formatDateForServer(isoString: string): string {
  // ISO 문자열을 Date 객체로 변환
  const date: Date = new Date(isoString);

  // 연도, 월, 일을 추출하여 2자리 형식으로 변환
  const year: string = date.getFullYear().toString();
  const month: string = (date.getMonth() + 1).toString().padStart(2, "0");
  const day: string = date.getDate().toString().padStart(2, "0");

  // YYYY-MM-DD 형식으로 반환
  return `${year}-${month}-${day}`;
}

export function formatDate(isoString: string): string {
  // ISO 문자열을 Date 객체로 변환
  const date: Date = new Date(isoString);

  // 옵션 설정: 날짜와 24시간 형식의 시간(시간과 분까지만) 포함
  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "long",
    day: "numeric",
  };

  // 형식을 지정하여 날짜와 시간 포맷팅
  const formattedDate: string = new Intl.DateTimeFormat("ko-KR", options).format(date);

  return formattedDate;
}

export function renderIconForReaction(reactionType: E_ReactionType) {
  switch (reactionType) {
    case E_ReactionType.check:
      return { icon: "mdi-check", color: "teal" };

    case E_ReactionType.stop:
      return { icon: "mdi-close-circle", color: "error" };
    case E_ReactionType.like:
      return { icon: "mdi mdi-thumb-up", color: "yellow-darken-2" };
    case E_ReactionType.wow:
      return { icon: "mdi mdi-emoticon-cool", color: "indigo-darken-4" };

    default:
      return { icon: "mdi-alert-circle", color: "warning" };
  }
}
export function countReactions(reactions: IReaction[]): Record<string, number> {
  const reactionCounts: Record<string, number> = {};

  reactions.forEach((reaction) => {
    const type = reaction.reactionType;
    if (!!type) {
      if (reactionCounts[type]) {
        reactionCounts[type]++;
      } else {
        reactionCounts[type] = 1;
      }
    }
  });
  return reactionCounts;
}

export const renderIconForVersionStatus = (status: E_TestStatus) => {
  switch (status) {
    case E_TestStatus.failed:
      return "Failed";
    case E_TestStatus.passed:
      return "Completed";
    default:
      return "in progress";
  }
};

export const renderTestStatus = (type: E_TestStatus) => {
  switch (type) {
    case E_TestStatus.failed:
      return "red";
    case E_TestStatus.passed:
      return "green";
    default:
      return "deep-orange";
  }
};
