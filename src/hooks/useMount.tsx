import { useEffect, useState } from "react";

const useMount = () => {
  const [isMount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, [setMount]);

  return isMount;
};
export default useMount;
