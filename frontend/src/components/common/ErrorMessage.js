const ErrorMessage = ({ errors }) => {
    return (
      <div className="alert alert-danger" role="alert">
        {errors.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
    );
};

export default ErrorMessage;