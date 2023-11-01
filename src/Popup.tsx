

const Popup = (props: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-4 rounded-lg relative">
        <button
          type="button"
          className="text-white text-lg absolute top-0 right-0 m-4"
          onClick={props.handleClose}
        >
          ×
        </button>
        {props.content}
      </div>
    </div>
  );
};

export default Popup;
