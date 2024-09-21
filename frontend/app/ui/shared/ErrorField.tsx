type ErrorFieldProps = {
  error?: string;
};

const ErrorField = ({ error }: ErrorFieldProps) =>
  error ? (
    <div className="dangerBackground rounded-md p-2 text-wrap text-xs max-w-0 min-w-full">
      <span className="white">{error}</span>
    </div>
  ) : null;

export default ErrorField;
