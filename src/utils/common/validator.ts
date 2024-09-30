export const checkEditorValueEmpty = (content: string) => {
  //true if empty
  let regex = /(<([^>]+)>)/gi;

  return content.replace(regex, "").length === 0;
};
