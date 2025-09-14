type GoalItemProps = {
  title: string;
  id: string;
  children?: React.ReactNode;
};
function GoalItem(props: GoalItemProps) {
  console.log(props);
  return (
    <li>
      {props.title} ID: {props.id} {props.children}
    </li>
  );
}

export default GoalItem;
