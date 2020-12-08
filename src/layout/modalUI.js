import { makeStyles } from '@material-ui/core/Styles';

export function GetModalStyle() {
	const top = 50;
	const left = 50;

	return{
		top: `${top}%`,
	    left: `${left}%`,
	    transform: `translate(-${top}%, -${left}%)`,
	};
}

export const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: "auto",
		backgroundColor: theme.palette.background.paper,
		border: 'none',
		outline: 'none',
		borderRadius: '5px',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		transition: 'height .5s',
	},
}));