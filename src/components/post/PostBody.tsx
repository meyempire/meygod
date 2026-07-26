interface PostBodyProps {
  html: string;
}

export default function PostBody({ html }: PostBodyProps) {
  return (
    <div
      className="prose max-w-none
        prose-p:my-5 prose-p:leading-relaxed prose-p:text-text
        prose-headings:scroll-mt-24
        prose-headings:font-bold
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-a:no-underline hover:prose-a:underline
        prose-code:px-1 prose-code:py-0.5 prose-code:rounded
        prose-img:rounded-xl
        prose-blockquote:border-red-500
        prose-strong:text-text
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
