import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import AppBar         from '@material-ui/core/AppBar';
import Tabs           from '@material-ui/core/Tabs';
import Tab            from '@material-ui/core/Tab';

const TabSlider = (props) =>
{
	const [value, setValue] = React.useState(0);
	return (
		<>
			<AppBar position='static' color='default'>
				<Tabs
					value          = {value}
					onChange       = {(_, v) => setValue(v)}
					indicatorColor = 'primary'
					textColor      = 'primary'
					variant        = 'fullWidth'
				>
					{
						props.entries.map(({label, icon, render}) => <Tab label={label} icon={icon} disabled={!render}/>)
					}
				</Tabs>
			</AppBar>
			<SwipeableViews axis='x' index={value} onChangeIndex={setValue}>
				{
					props.entries.map(({render}, index) =>
						<div hidden={value !== index} className='p-4'>
							{value === index && render}
						</div>
					)
				}
			</SwipeableViews>
		</>
	);
}

export default TabSlider;
