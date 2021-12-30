import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { addSlots, addData, onUpdate } from "../../parkingReducer";
import "./index.css";

const FormData = () => {
    const [generateSlots, setGeneratedSlots] = useState(0);

    const slots = useSelector((state) => state.addReducer.slots);
    const parkingDataList = useSelector((state) => state.addReducer.dataList);

    const onClickEdit = useSelector((state) => state.addReducer.clickEdit);
    console.log(onClickEdit);

    const editableData = useSelector((state) => state.addReducer.editableData);
    const editableObject = editableData[0];

    const [formData, setFormData] = useState({
        ownerName: "",
        registrationNumber: "",
        vehicleColor: "",
        slotNumber: "",
    });

    const [errorMsgObject, setMsgErrorObject] = useState({});

    useEffect(() => {
        if (editableData.length !== 0) {
            setFormData({
                ownerName: editableData[0].ownerName,
                registrationNumber: editableData[0].registrationNumber,
                vehicleColor: editableData[0].vehicleColor,
                slotNumber: editableData[0].slotNumber,
            });
        } else {
            setFormData({
                ownerName: "",
                registrationNumber: "",
                vehicleColor: "",
                slotNumber: "",
            });
        }
    }, [editableData]);

    // //console.log(ownerName, registrationNumber, slotNumber);

    const disPatch = useDispatch();

    const onClickGenerateSlots = () => {
        disPatch(addSlots(parseInt(generateSlots)));
        setGeneratedSlots(0);
    };

    //-------------------------------------------------------//
    //-------------------------------------------------------//

    const validateColor = (data) => {
        var s = new Option().style;
        s.color = data;
        return s.color === data.toLowerCase();
    };
    const validateCharacters = (data) => {
        var regex = /^([a-zA-Z ]+)$/;
        return regex.test(data);
    };
    const validateRegNumber = (data) => {
        var regex = /^[A-Za-z]{2}[0-9]{2}(-)[A-Za-z]{2}(-)[0-9]{4}$/;
        return regex.test(data);
    };
    const validateSlot = (data) => {
        var regex = /^[0-9]+$/;
        return regex.test(data);
    };

    const validation = (errorObject) => {
        let retValue = true;
        const isSlotExist = parkingDataList.find(
            (each) =>
                parseInt(each.slotNumber) === parseInt(formData.slotNumber)
        );
        const isVehExist = parkingDataList.find(
            (each) => each.registrationNumber === formData.registrationNumber
        );
        if (formData.ownerName === "") {
            errorObject.ownerNameError = "Enter The Name";
            retValue = false;
        } else if (!validateCharacters(formData.ownerName)) {
            errorObject.ownerNameError = "Enter The Valid Name";
            retValue = false;
        }
        if (formData.registrationNumber === "") {
            errorObject.regNumberError = "Enter The regNumber";
            retValue = false;
        } else if (!validateRegNumber(formData.registrationNumber)) {
            errorObject.regNumberError = "Enter The Valid Registration number";
            retValue = false;
        } else if (
            isVehExist &&
            editableData[0] !== undefined &&
            formData.registrationNumber !== editableData[0].registrationNumber
        ) {
            errorObject.regNumberError = "registration Already Exists";
            retValue = false;
        } else if (isVehExist && editableData[0] === undefined) {
            errorObject.regNumberError = "registration number alredy exist";
            retValue = false;
        }

        if (formData.vehicleColor === "") {
            errorObject.vehicleColorError = "Enter The vehicleColor";
            retValue = false;
        } else if (!validateColor(formData.vehicleColor)) {
            errorObject.vehicleColorError = "Enter The Valid Color";
            retValue = false;
        }
        if (formData.slotNumber === "") {
            errorObject.slotNumberError = "Enter The slotNumber";
            retValue = false;
        } else if (!validateSlot(formData.slotNumber)) {
            errorObject.slotNumberError = "Enter The Valid slot";
            retValue = false;
        } else if (
            !(
                parseInt(formData.slotNumber) > 0 &&
                parseInt(formData.slotNumber) <= slots
            )
        ) {
            errorObject.slotNumberError = `Enter Slot Number Between 1 to ${slots}`;
            retValue = false;
        } else if (
            isSlotExist &&
            editableData[0] !== undefined &&
            formData.slotNumber !== editableData[0].slotNumber
        ) {
            errorObject.slotNumberError = "SlotNumber Already Exists";
            retValue = false;
        } else if (isSlotExist && editableData[0] === undefined) {
            errorObject.slotNumberError = "SlotNumber Already Exists";
            retValue = false;
        }
        return retValue;
    };

    //-------------------------------------------------------//
    const validate = () => {
        const errorObject = {};
        let valRet = true;
        // const isSlotExist = allotedSlots.find(
        // 	(each) => parseInt(each.slotNumber) === parseInt(form.slotNumber)
        // );
        if (slots === parkingDataList.length) {
            if (editableData.length === 0) {
                console.log("hjk");
                errorObject.noSlots = "No more slots available";
                valRet = false;
            } else {
                valRet = validation(errorObject);
            }
        } else {
            valRet = validation(errorObject);
        }

        setMsgErrorObject(errorObject);
        return valRet;
    };

    //-------------------------------------------------------//

    const onSubmitForm = (event) => {
        event.preventDefault();
        if (slots === 0) {
            alert("Please Generate Slots");
        } else if (validate()) {
            if (onClickEdit === false) {
                const userObject = {
                    id: v4(),
                    slotNumber: formData.slotNumber,
                    registrationNumber: formData.registrationNumber,
                    ownerName: formData.ownerName,
                    vehicleColor: formData.vehicleColor,
                };
                //console.log(userObject);

                if (slots - parkingDataList.length > 0) {
                    disPatch(addData(userObject));
                } else {
                    alert("No Slot Available");
                }
            } else {
                const editableId = editableObject.id;
                const userObject = {
                    id: editableId,
                    slotNumber: formData.slotNumber,
                    registrationNumber: formData.registrationNumber,
                    ownerName: formData.ownerName,
                    vehicleColor: formData.vehicleColor,
                };
                disPatch(onUpdate(userObject));
            }
            setFormData({
                ownerName: "",
                registrationNumber: "",
                vehicleColor: "",
                slotNumber: "",
            });
        }
    };

    return (
        <div className="form-data-container">
            <form className="form-input" onSubmit={onSubmitForm}>
                <input
                    type="text"
                    placeholder="Owner_Name"
                    className="input-field"
                    value={formData.ownerName}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            ownerName: e.target.value,
                        }))
                    }
                />
                <p className="error-msg ">{errorMsgObject.ownerNameError}</p>
                <input
                    type="text"
                    placeholder="Registration_Number"
                    className="input-field"
                    value={formData.registrationNumber}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            registrationNumber: e.target.value,
                        }))
                    }
                />
                <p className="error-msg ">{errorMsgObject.regNumberError}</p>
                <input
                    type="text"
                    placeholder="Car/Bike_Color"
                    className="input-field"
                    value={formData.vehicleColor}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            vehicleColor: e.target.value,
                        }))
                    }
                />
                <p className="error-msg ">{errorMsgObject.vehicleColorError}</p>
                <input
                    type="text"
                    placeholder="Slot_Number"
                    className="input-field"
                    value={formData.slotNumber}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            slotNumber: e.target.value,
                        }))
                    }
                />
                <p className="error-msg ">{errorMsgObject.slotNumberError}</p>
                <button type="submit" className="slot-button">
                    Allot the Slot
                </button>
            </form>

            <div className="slot-generator-bg">
                <div className="slot-input-container">
                    <label htmlFor="slotInput" className="generate-text">
                        Generate Slots :
                    </label>
                    <input
                        value={generateSlots === 0 ? "" : generateSlots}
                        id="slotInput"
                        type="number"
                        placeholder=""
                        className="slot-input"
                        onChange={(e) => setGeneratedSlots(e.target.value)}
                    />
                </div>
                <button
                    className="generate-button"
                    onClick={onClickGenerateSlots}
                >
                    Generate
                </button>
                <p className="generate-text">
                    Available Slots:{" "}
                    <span className="available-slot">
                        {slots - parkingDataList.length}
                    </span>
                </p>
                <p className="generate-text">
                    Alloted Slots:{" "}
                    <span className="available-slot">
                        {parkingDataList.length}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default FormData;
