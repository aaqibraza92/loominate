import { Modal, ModalProps } from "antd";
import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { DateRange } from "react-date-range";
import colors from "../../commons/styles/colors";
import "./styles.scss";

interface Props extends ModalProps {
  visible?: boolean;
  zIndex?: number;
  onSelected?: any;
}

/**
 * DateRangePicker Component
 * @param { Props} props
 * @returns JSX.Element
 */
function DateRangePicker(props: Props) {
  const { visible, zIndex = 1100, onSelected } = props;
  const [modalShow, setModalShow] = useState(visible);
  const [selectionRange, setSelectionRange] = useState<any>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  useEffect(() => {
    setModalShow(visible);
  }, [visible]);
  const {
    /**
     * Set default event
     */
    onCancel = () => {
      setModalShow(false);
    },

    /**
     * Set default event
     */
    onOk = () => {
      setModalShow(false);
    },
  } = props;

  const onDateChange = (item: any) => {
    setSelectionRange([item.selection]);
  };

  const onSubmit = () => {
    setModalShow(false);
    if(onSelected) onSelected(selectionRange[0])
  };

  return (
    <Modal
      visible={modalShow}
      className="modal-date-range"
      centered
      footer={null}
      destroyOnClose={true}
      onCancel={onCancel}
      width="calc(100% - 82px)"
    >
      <DateRange
        editableDateInputs={false}
        ranges={selectionRange}
        moveRangeOnFirstSelection={false}
        rangeColors={[colors.primary]}
        direction="vertical"
        scroll={{ enabled: true }}
        onChange={onDateChange}
      />
      <Stack className="p-3 pb-3">
        <button className="btn btn-submit" onClick={onSubmit}>OK</button>
      </Stack>
    </Modal>
  );
}

export default DateRangePicker;
