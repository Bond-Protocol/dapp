import { Button } from "ui";

type CancelOrderDialogProps = {
  onCancel: () => void;
  onSubmit: () => void;
};

export const CancelOrderDialog = (props: CancelOrderDialogProps) => {
  return (
    <div className="p-4">
      <div className="text-center ">
        This action will cancel all orders, are you sure?
      </div>
      <div className="mt-2 text-center text-sm text-light-grey-400">
        (It won't cost any gas)
      </div>
      <div className="mt-6 flex w-full justify-center gap-x-2">
        <Button
          size="lg"
          className="w-1/2"
          variant="ghost"
          onClick={props.onCancel}
        >
          Go back
        </Button>
        <Button size="lg" className="w-1/2" onClick={props.onSubmit}>
          Confirm
        </Button>
      </div>
    </div>
  );
};
