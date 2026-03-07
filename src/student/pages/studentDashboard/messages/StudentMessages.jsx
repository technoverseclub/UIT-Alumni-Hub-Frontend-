import ChatLayout from "../../../../chat";
import { useSearchParams } from "react-router-dom";

const StudentMessages = () => {
  const [searchParams] = useSearchParams();
  const initialTargetUserId =
    searchParams.get("targetUserId") || searchParams.get("userId");

  return (
    <div className="h-[calc(100vh-12rem)] min-h-[400px]">
      <ChatLayout initialTargetUserId={initialTargetUserId} />
    </div>
  );
};

export default StudentMessages;

