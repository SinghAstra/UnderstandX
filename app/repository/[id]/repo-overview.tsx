import { JSXElementConstructor, ReactElement } from "react";

interface RepoOverviewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedOverview: ReactElement<any, string | JSXElementConstructor<any>> | null;
}

const RepoOverview = ({ parsedOverview }: RepoOverviewProps) => {
  return (
    <div className="w-full flex-1 p-3 ml-96">
      <div className="border rounded-md px-4 py-3 ">{parsedOverview}</div>
    </div>
  );
};

export default RepoOverview;
