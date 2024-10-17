export const checkEditorValueEmpty = (content: string) => {
  //true if empty
  // true if empty
  let textOnlyRegex = /(<([^>]+)>)/gi;
  let imgRegex = /<img[^>]*>/gi;

  // 텍스트만 남겨서 확인
  const textContent = content.replace(textOnlyRegex, "").trim();

  // 이미지가 있는지 확인
  const hasImage = imgRegex.test(content);

  // 텍스트가 없고 이미지도 없을 경우 빈 것으로 처리
  return textContent.length === 0 && !hasImage;
};
