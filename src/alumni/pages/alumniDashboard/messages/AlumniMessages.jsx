import ChatLayout from "../../../../chat";
import { useSearchParams } from "react-router-dom";

const AlumniMessages = () => {
  const [searchParams] = useSearchParams();
  const initialTargetUserId = searchParams.get("targetUserId");

  return (
    <div className="h-[calc(100vh-12rem)] min-h-100">
      <ChatLayout initialTargetUserId={initialTargetUserId} />
    </div>
  );
};

export default AlumniMessages;