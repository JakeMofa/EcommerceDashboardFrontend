import GeneralMain from "./General/Main";

export default function General({ user, userRole }) {
  return (
    <>
      <GeneralMain {...{ user, userRole }} />
    </>
  );
}
