import React from "react";
import {Grid, Skeleton} from "@mui/material";

const TrackSkeleton = () => {
    return (
        <>
            <Grid container spacing={1}
                  style={{margin: 0, display: "flex", alignItems: "center", justifyContent: "center"}}
                  className="track">
                <Grid item sm={1} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <Skeleton variant="text" width={40} height={20}/>
                </Grid>
                <Grid xs={1} sm={1} item className="image-container-wrapper">
                    <div className={` skeleton`}>
                        <Skeleton variant="rectangular" height={50}/>
                    </div>
                </Grid>
                <Grid style={{paddingLeft: "3%"}} sm={7}>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                        <Skeleton variant="text" width={200} height={20}/>
                        <Skeleton variant="text" width={150} height={20}/>
                    </div>
                </Grid>
                <Grid item sm={1}>
                    <Skeleton variant="text" width={60} height={20}/>
                </Grid>
                <Grid item sm={1}>
                    <Skeleton variant="text" width={60} height={20}/>
                </Grid>
                <Grid item sm={1}>
                    <Skeleton variant="circle" width={40} height={40}/>
                </Grid>
            </Grid>
        </>
    );
};

export default TrackSkeleton;
