import { useInView } from 'react-intersection-observer';

interface InfiniteScrollProps extends React.PropsWithChildren {
  onBottomReached: () => void;
  className?: string;
}

const InfiniteScrollContainer = ({
  children,
  onBottomReached,
  className
}: InfiniteScrollProps) => {
  const { ref } = useInView({
    rootMargin: '200px',
    onChange(inView) {
      if (inView) {
        onBottomReached();
      }
    }
  });
  return (
    <div className={className}>
      {children}
      <div ref={ref}></div>
    </div>
  );
};

export default InfiniteScrollContainer;