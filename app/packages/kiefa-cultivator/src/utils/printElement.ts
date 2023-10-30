function printElementById(id: string, styles?: string[]) {
  if (document) {
    const element = document?.getElementById(id)?.outerHTML as string;
    let newWin = window?.open("", "", "height=650, width=650");
    newWin?.document.write(
      `<style>${styles
        ?.map((style) => `#${id} ${style}`)
        .join(" ")}</style>${element}`
    );
    newWin?.print();
    newWin?.close();
  }
}

export default printElementById;
