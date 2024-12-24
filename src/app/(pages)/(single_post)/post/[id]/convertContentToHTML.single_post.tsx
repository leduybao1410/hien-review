"use client"

const ConvertContentToHTML = ({ content }: { content: string }) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const images = doc.querySelectorAll('img');
    images.forEach((img, index) => {
        img.classList.add('uploaded-image');
    });
    console.log(doc.body.innerHTML);
    return <div dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }} />;
}

export default ConvertContentToHTML;
