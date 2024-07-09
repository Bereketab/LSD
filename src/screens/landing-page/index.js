import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline, Typography, Collapse, IconButton, Paper, Link } from '@material-ui/core';
import { ExpandMore, Person } from '@material-ui/icons';
import { Services } from '../../components';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '95vh',
    backgroundImage: `url('https://images.pexels.com/photos/1573885/pexels-photo-1573885.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')`,
    backgroundRepeat: 'no-repeat',
    backgroundWidth: 'cover',
    marginTop: -20,
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  whiteText: {
    color: '#ffffff'
  },
  blackText: {

  },
  contentContainer: {
    width: '50%',
    margin: '0 auto',
    zIndex: 9999
  },
  overlay: {
    width: '100%',
    height: '95%',
    background: '#00000066',
    position: 'absolute',
  },
  expandIcon: {
    fontSize: '3em'
  }
}));

export default function LandingPage() {
  const [checked, setChecked] = useState(false);
  const classes = useStyles();

  // start collapse animation
  useEffect(() => {
    setChecked(true);
  }, []);

  return (
    <div>
      {/** header */}
      <div className={`${classes.root} ${classes.center}`}>
        <div className={classes.overlay} />
        <CssBaseline />
        <div className={`${classes.contentContainer}`}>
          <Collapse in={checked} collapsedHeight={70} {...(checked ? { timeout: 1000 } : {})} >
            <Typography variant="h3" component="h3" align="center" gutterBottom className={`${classes.whiteText}`}>
              Landscape Doctor Toolbox
           </Typography>

            <Typography variant="body1" paragraph gutterBottom align='center' className={`${classes.whiteText}`}>
              Landscape doctor is an online platformthat   provides   data   and   tools   forassisting landscape restoration efforts.It   adopted   the   medical   procedureswhere   treatments   are   providedfollowing a diagnosis.   It starts fromdiagnosing the landscape in terms soilfertility status, landscape degradation;provide   prescription   on   restorationtechnologies; examine the changes and impacts of the restoration technologies;and finally, what types of trade-offs and synergies can be observed due to anyland management interventions.
          </Typography>
            <div className={classes.center}>
              <IconButton color="primary" className={classes.whiteText}>
                <ExpandMore className={classes.expandIcon} />
              </IconButton>
            </div>
          </Collapse>
        </div>
      </div>
      {/** Services */}
      <Services />
      <div style={{ height: '50vh' }}>
        <Typography variant="h3" component="h3" align="center" gutterBottom className={`${classes.blackText}`}>
          Contact Us
        </Typography>
        <Typography variant="body1" align="center" gutterBottom className={`${classes.blackText}`}>
          For more inquiries
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1em', alignItems: 'center' }}>

          <Paper elevation={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 30px' }}>
            <Person />
            <div style={{ margin: '0px 10px' }}>
              <Typography variant="subtitle1" gutterBottom align="center" className={`${classes.blackText}`}>
                Dr Lulseged Tamane
            </Typography>
              <Link href="#">
                (LT.Desta@CGIAR.ORG)
            </Link>
            </div>

          </Paper>

          <Paper elevation={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 30px' }}>
            <Person />
            <div style={{ margin: '0px 10px' }}>
              <Typography variant="subtitle1" gutterBottom align="center" className={`${classes.blackText}`}>
                Dr Wuletawu Abera
            </Typography>
              <Link href="#">
                (Wuletawu.Abera@cgiar.org)
          </Link>
            </div>


          </Paper>

          <Paper elevation={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 30px' }}>
            <Person />
            <div style={{ margin: '0px 10px' }}>
              <Typography variant="subtitle1" gutterBottom align="center" className={`${classes.blackText}`}>
                Dr Kalkidan Mulatu
          </Typography>
              <Link href="#">
                (K.Mulatu@cgiar.org)
          </Link>
            </div>


          </Paper>

        </div>
      </div>
    </div>
  );
}
