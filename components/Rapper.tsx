const Rapper = ({ children, className }: { children: React.ReactNode, className?:string }) => {
  return (
    <div className={`max-w-[1400px] overflow-hidden mx-auto ${className}`}>{children}</div>
  );
};

export default Rapper;
