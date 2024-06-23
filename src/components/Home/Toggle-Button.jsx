import React from 'react';

function ToggleButtons({ selectedTabIndex, onChangeTab}) {

    

  return (
    <div
      style={{
        padding: '15px',
        borderRadius: '20px',
        backgroundColor: 'yourColorScheme.tertiaryContainer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          selected={selectedTabIndex === 0}
          onClick={() => onChangeTab(0)}
          title="About me"
        />
        
          <Button
            selected={selectedTabIndex === 1}
            onClick={() => onChangeTab(1)}
            title="User Journey"
          />
        
        <Button
          selected={selectedTabIndex === 2}
          onClick={() => onChangeTab(2)}
          title="Reviews"
        />
      </div>
    </div>
  );
}

function Button({ selected, onClick, title }) {
  const textColor = selected ? 'yourColorScheme.onTertiaryContainer' : 'black';
  const buttonStyle = {
    backgroundColor: selected ? 'yourSelectedButtonColor' : 'white',
    color: textColor,
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      {title}
    </button>
  );
}

export default ToggleButtons;