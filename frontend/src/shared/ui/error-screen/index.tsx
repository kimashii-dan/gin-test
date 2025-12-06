export default function ErrorScreen({
  text,
  code,
}: {
  text: string;
  code?: number;
}) {
  return (
    <div className="max-w-11/12 md:max-w-10/12 flex flex-col justify-center items-center h-[70vh] gap-5 w-full">
      {code && (
        <h1 className="text-7xl font-medium text-destructive">{code}</h1>
      )}

      <h2 className="text-4xl font-nice italic font-medium text-destructive text-center">
        {text}
      </h2>
    </div>
  );
}
