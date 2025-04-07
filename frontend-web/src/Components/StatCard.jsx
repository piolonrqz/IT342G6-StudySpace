const StatCard = ({ title, value, bgColor }) => {
    return (
      <div className={`${bgColor} p-5 rounded-md`}>
        <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
        <p className="text-3xl font-semibold">{value}</p>
      </div>
    );
  };
  
  export default StatCard;