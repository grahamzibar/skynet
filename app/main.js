_skynet = new SkyNet(new ARDroneCommunicator());
_view = new SkyNetView();
_controller = new SkyNetController(_skynet, _view);