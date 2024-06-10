import PropTypes from "prop-types";
import { useEffect, useReducer } from "react";
import { validate } from "../../../public/validators";
function inputReducer(state, action) {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
}

export default function Input({
  elem,
  type,
  placeholder,
  className,
  rows,
  errorText,
  validator,
  id,
  val,
  numVal,
  valid,
  onInput = () => {},
  onType = () => {},
}) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: val || numVal || "",
    isTouched: false,
    isValid: valid || false,
  });

  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  useEffect(() => {
    onType(value);
  }, [value, onType]);

  function handleChange(event) {
    dispatch({
      type: "CHANGE",
      value: event.target.value,
      validators: validator,
    });
  }

  function handleTouch() {
    dispatch({
      type: "TOUCH",
    });
  }

  const element =
    elem === "input" ? (
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        className={`${className} ${
          !inputState.isValid && inputState.isTouched && "error-input"
        }`}
        onChange={handleChange}
        onBlur={handleTouch}
      />
    ) : (
      <textarea
        placeholder={placeholder}
        className={className}
        rows={rows || 3}
        onChange={handleChange}
        onBlur={handleTouch}
        value={value}
      />
    );

  return (
    <>
      {element}
      {!inputState.isValid && inputState.isTouched && (
        <p style={{ color: "red" }}>{errorText}</p>
      )}
    </>
  );
}

Input.propTypes = {
  elem: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  rows: PropTypes.string,
  errorText: PropTypes.string,
  validator: PropTypes.array,
  id: PropTypes.string,
  onInput: PropTypes.func,
  val: PropTypes.string,
  valid: PropTypes.bool,
  onType: PropTypes.func,
  numVal: PropTypes.number,
};
