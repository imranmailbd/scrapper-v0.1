import React from 'react';

import { SidebarMenu } from './../../components';

export const SidebarMiddleNav = () => (
    <SidebarMenu>
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-home" to='/dashboards/projects' exact ></i>}
            title="Dashboards"
        >
           
           
           
        </SidebarMenu.Item>
        
        { /* -------- Tables ---------*/ }
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-trello"></i>}
            title="Stock"
        >            
            <SidebarMenu.Item title="All Stock File" to='/tables/extended-table' />
            <SidebarMenu.Item title="Stock" to='/tables/stock-market' />
            <SidebarMenu.Item title="Scraping" to='/forms/scraping' />
            <SidebarMenu.Item title="Upload Stock List" to='/forms/form-csv-upload' />
        </SidebarMenu.Item>
        
           
               
    </SidebarMenu >
);
