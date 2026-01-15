import React, { useEffect, useState, useRef } from 'react'
import { useProjectStore } from '../store/project';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
//import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Universities } from '../components/Universities';
import MyMap from '../components/Map.jsx';

const ProjectsPage = () => {

    const { projects, fetchProjects } = useProjectStore();

    useEffect(() => {
        fetchProjects();
    }, []);

    console.log("📌 Projects in store post to fetch:", projects);

    console.log('Google Maps API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
    console.log('Google Maps ID:', import.meta.env.VITE_GOOGLE_PROJECTS_MAP_ID);

    return (
        <div>
            <MyMap content={projects}></MyMap>
        </div>
    )
}

export default ProjectsPage