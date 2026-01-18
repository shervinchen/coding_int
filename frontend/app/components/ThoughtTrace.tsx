import './ThoughtTrace.css';

type ThoughtTraceProps = {
  status: string;
  isThinking: boolean;
};

const ThoughtTrace: React.FC<ThoughtTraceProps> = ({ status, isThinking }) => {
  return (
    <div className={`thought-trace ${isThinking ? 'thinking' : ''}`}>
      <span>{status}</span>
      {isThinking && <div className="spinner"></div>}
    </div>
  );
};

export default ThoughtTrace;