import SubmitButton from "@/components/submit-button";
import GoalItem from "@/components/Goal-Item";

function Test() {
  return (
    <>
      <SubmitButton />
      <GoalItem id="g1" title="Learn React">
        👉 额外的说明
      </GoalItem>
      <h1>Sub/Test Page</h1>
    </>
  );
}
export default Test;
