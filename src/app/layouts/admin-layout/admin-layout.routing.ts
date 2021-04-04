import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';

import { NodesComponent } from "../../pages/nodes/nodes.component";
import { NewNodeComponent } from '../../pages/nodes/new-node/new-node.component';
import { BlockchainViewComponent }  from '../../pages/blockchain-view/blockchain-view.component';
import { RegisterManufacturerComponent } from '../../pages/register-manufacturer/register-manufacturer.component';

//Dylan
import { AddItemComponent }         from '../../pages/add-item/add-item.component';
import { UpdateItemComponent } from '../../pages/update-item/update-item.component';
import { ViewAllCreatedItemsComponent } from '../../pages/view-all-created-items/view-all-created-items.component';
import { TrackItemComponent } from '../../pages/track-item/track-item.component';

export const AdminLayoutRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: "full"},
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user',           component: UserComponent },
    { path: 'table',          component: TableComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'nodes',          component: NodesComponent, children : [
        {path: 'new-node',    component: NewNodeComponent}
    ]},
    { path: 'blockchain',     component: BlockchainViewComponent },
    { path: 'register',       component: RegisterManufacturerComponent },
    { path: 'addItem',        component: AddItemComponent },
    { path: 'updateItem',        component: UpdateItemComponent },
    { path: 'viewCreatedItems',        component: ViewAllCreatedItemsComponent },
    { path: 'tracking',        component: TrackItemComponent },
];
