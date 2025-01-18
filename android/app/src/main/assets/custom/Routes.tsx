interface RoutesInterface {

    Splash:never | string,
    Home:any
    Settings:any
    HomeTabbar:any
    CreateNewMeeting:any
    Reminders:any
    MyProfile:any
    EditProfile:any


}
export const Routes:RoutesInterface = {
    Splash:'Splash',
    Home:'Home',
    Settings:'Settings',
    HomeTabbar:'HomeTabbar',
    CreateNewMeeting: 'CreateNewMeeting',
    Reminders: 'Reminders',
    MyProfile:'MyProfile',
    EditProfile:'EditProfile'

}