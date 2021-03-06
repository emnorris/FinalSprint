package edu.uark.registerapp.controllers;

import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import edu.uark.registerapp.controllers.enums.ViewNames;
import edu.uark.registerapp.models.entities.ActiveUserEntity;

@Controller
@RequestMapping(value = "/transaction")
public class TransactionController extends BaseRouteController {
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView showTransaction(
		@RequestParam final Map<String, String> queryParameters,
		final HttpServletRequest request
	) {		
		final Optional<ActiveUserEntity> activeUserEntity =
			this.getCurrentUser(request);
		if (!activeUserEntity.isPresent()) {
			return buildInvalidSessionResponse();
		}

		ModelAndView modelAndView =
			this.setErrorMessageFromQueryString(
				new ModelAndView(ViewNames.TRANSACTION.getViewName()),
				queryParameters);
		
		return modelAndView;
	}


}
